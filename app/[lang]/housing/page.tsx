'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import initTranslations from '@/i18n';
import filterValues from '@/filters/filterValues';

interface HousingPageProps {
  params: {
    lang: string
  }
}

interface HousingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  type: string;
  image: string;
  city: string;
  district: string;
}

const HousingPage: React.FC<HousingPageProps> = ({ params: { lang } }) => {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCurrency, setSelectedCurrency] = useState<'usd' | 'gel'>('usd');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('none');
  const [currencyRate, setCurrencyRate] = useState<number>(1); // USD to GEL rate

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(lang, ['common']);
      setT(() => t);
    };
    loadTranslations();
  }, [lang]);

  useEffect(() => {
    // Fetch currency rate from the API
    const fetchCurrencyRate = async () => {
      try {
        const response = await fetch('/api/getCurrency');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const usdCurrency = data.currencies.find((currency: any) => currency.code === 'USD');
        if (usdCurrency) {
          setCurrencyRate(parseFloat(usdCurrency.rateFormated));
        }
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };
    fetchCurrencyRate();
  }, []);

  const changeLanguage = (newLang: string) => {
    router.push(`/${newLang}/housing`);
    toast({
      title: t('languageChanged'),
      description: t('languageChangedDescription'),
    });
  };

  const { housingCategories, housingTypes, locations, rentDurations } = filterValues;

  const housingItems: HousingItem[] = [];

  const filteredItems = housingItems.filter(item => {
    const matchesSearchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || item.city === selectedLocation;
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesPriceRange = item.price >= priceRange[0] && item.price <= priceRange[1];

    return matchesSearchQuery && matchesCategory && matchesType && matchesLocation && matchesDistrict && matchesPriceRange;
  });

  const maxPrice = selectedCurrency === 'usd' ? 5000 : 5000 * currencyRate;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-bold text-xl">
            {t('portalName')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('ka')}>
                <span className="mr-2">🇬🇪</span> ქართული
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                <span className="mr-2">🇬🇧</span> English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ru')}>
                <span className="mr-2">🇷🇺</span> Русский
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('housing')}</h1>
          <Button asChild>
            <Link href="/housing/create">
              <Plus className="mr-2 h-4 w-4" /> {t('createListing')}
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder={t('searchHousing')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {housingCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t('filters')}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t('filters')}</SheetTitle>
                <SheetDescription>{t('applyFilters')}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('minimumRentDuration')}</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectMinDuration')} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentDurations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('city')}</label>
                  <Select value={selectedLocation} onValueChange={(value) => {
                    setSelectedLocation(value);
                    setSelectedDistrict('all');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCity')} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('district')}</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectDistrict')} />
                    </SelectTrigger>
                    <SelectContent>
                      {(locations.find(location => location.value === selectedLocation)?.districts || []).map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('priceRange')}</label>
                  <Slider
                    min={0}
                    max={maxPrice}
                    step={50}
                    value={priceRange}
                    onValueChange={(values) => setPriceRange(values as [number, number])}
                    className="mb-4"
                  />
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={0}
                      max={maxPrice}
                      step={50}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      min={0}
                      max={maxPrice}
                      step={50}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full"
                    />
                    <Select value={selectedCurrency} onValueChange={(currency: 'usd' | 'gel') => setSelectedCurrency(currency)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectCurrency')} />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { value: 'usd', label: 'USD ($)' },
                          { value: 'gel', label: 'GEL (₾)' },
                        ].map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="space-y-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/4">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full sm:w-3/4 p-4">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="font-bold mb-2">{selectedCurrency === 'usd' ? '$' : '₾'}{item.price} {item.category === 'rent' ? t('perMonth') : ''}</p>
                    <p className="text-sm mb-2">{t(item.city)} - {t(item.district)}</p>
                    <Badge>{t(item.category)}</Badge>
                    <Badge variant="outline">{t(item.type)}</Badge>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t bg-background/95 p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} {t('portalName')}. {t('allRightsReserved')}.
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              {t('about')}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              {t('contact')}
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HousingPage;
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

interface JobsPageProps {
  params: {
    lang: string
  }
}

interface JobItem {
  id: string;
  title: string;
  company: string;
  description: string;
  salary: number;
  location: string;
  category: string;
  type: string;
  experience: string;
  workFormat: string;
  companyLocation: string;
  postedDate: string;
  deadline: string | null;
}

const JobsPage: React.FC<JobsPageProps> = ({ params: { lang } }) => {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedWorkFormat, setSelectedWorkFormat] = useState('all');
  const [salaryRange, setSalaryRange] = useState([0, 10000]);
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(lang, ['common']);
      setT(() => t);
    };
    loadTranslations();
  }, [lang]);

  const changeLanguage = (newLang: string) => {
    router.push(`/${newLang}/jobs`);
    toast({
      title: t('languageChanged'),
      description: t('languageChangedDescription'),
    });
  };

  const jobCategories = [
    { value: 'all', label: t('allCategories') },
    { value: 'it', label: t('it') },
    { value: 'education', label: t('education') },
    { value: 'hospitality', label: t('hospitality') },
    { value: 'finance', label: t('finance') },
    { value: 'healthcare', label: t('healthcare') },
    { value: 'other', label: t('other') },
  ];

  const jobTypes = [
    { value: 'all', label: t('allTypes') },
    { value: 'fullTime', label: t('fullTime') },
    { value: 'partTime', label: t('partTime') },
    { value: 'contract', label: t('contract') },
    { value: 'internship', label: t('internship') },
  ];

  const experienceLevels = [
    { value: 'all', label: t('allLevels') },
    { value: 'entry', label: t('entry') },
    { value: 'junior', label: t('junior') },
    { value: 'mid', label: t('mid') },
    { value: 'senior', label: t('senior') },
  ];

  const workFormats = [
    { value: 'all', label: t('allFormats') },
    { value: 'remote', label: t('remote') },
    { value: 'hybrid', label: t('hybrid') },
    { value: 'office', label: t('office') },
  ];

  const locations = [
    { value: 'all', label: t('allLocations') },
    { value: 'tbilisi', label: t('tbilisi') },
    { value: 'batumi', label: t('batumi') },
    { value: 'kutaisi', label: t('kutaisi') },
    { value: 'rustavi', label: t('rustavi') },
    { value: 'other', label: t('otherLocation') },
  ];

  const jobItems: JobItem[] = [
    { 
      id: '1', 
      title: 'Software Developer', 
      company: 'TechCo', 
      description: 'Experienced React developer needed for a growing startup', 
      salary: 4000, 
      location: 'Tbilisi', 
      category: 'it', 
      type: 'fullTime', 
      experience: 'mid',
      workFormat: 'hybrid',
      companyLocation: 'Tbilisi',
      postedDate: '2024-10-01',
      deadline: '2024-10-31'
    },
    { 
      id: '2', 
      title: 'English Teacher', 
      company: 'Language School', 
      description: 'Native English speaker required for teaching adults', 
      salary: 1800, 
      location: 'Batumi', 
      category: 'education', 
      type: 'partTime', 
      experience: 'entry',
      workFormat: 'office',
      companyLocation: 'Batumi',
      postedDate: '2024-10-02',
      deadline: null
    },
    // ... (другие вакансии)
  ];

  const filteredItems = jobItems.filter(item =>
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    (selectedType === 'all' || item.type === selectedType) &&
    (selectedExperience === 'all' || item.experience === selectedExperience) &&
    (selectedWorkFormat === 'all' || item.workFormat === selectedWorkFormat) &&
    (selectedLocation === 'all' || item.location === selectedLocation) &&
    (item.salary >= salaryRange[0] && item.salary <= salaryRange[1])
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* ... (содержимое header) */}
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('jobs')}</h1>
          <Button asChild>
            <Link href="/jobs/create">
              <Plus className="mr-2 h-4 w-4" /> {t('postJob')}
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder={t('searchJobs')}
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
              {jobCategories.map((category) => (
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
                  <label className="block text-sm font-medium mb-1">{t('jobType')}</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectJobType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('experienceLevel')}</label>
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectExperience')} />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('workFormat')}</label>
                  <Select value={selectedWorkFormat} onValueChange={setSelectedWorkFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectWorkFormat')} />
                    </SelectTrigger>
                    <SelectContent>
                      {workFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('location')}</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectLocation')} />
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
                  <label className="block text-sm font-medium mb-1">{t('salaryRange')}</label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${salaryRange[0]}</span>
                    <span>${salaryRange[1]}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="space-y-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">{item.company}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="font-bold mb-2">${item.salary}</p>
                  <p className="text-sm mb-2">{item.location}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge>{t(item.category)}</Badge>
                    <Badge variant="outline">{t(item.type)}</Badge>
                    <Badge variant="secondary">{t(item.experience)}</Badge>
                    <Badge variant="secondary">{t(item.workFormat)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('companyLocation')}: {item.companyLocation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('postedDate')}: {item.postedDate}
                  </p>
                  {item.deadline && (
                    <p className="text-sm text-muted-foreground">
                      {t('deadline')}: {item.deadline}
                    </p>
                  )}
                </CardContent>
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
  )
}

export default JobsPage
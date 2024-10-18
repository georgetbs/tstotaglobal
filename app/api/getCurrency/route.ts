// app/api/getCurrency/route.ts

import fetch from 'node-fetch';
import moment from 'moment-timezone';

// Интерфейс для отдельной валюты
interface Currency {
  code: string;
  rateFormated: string;
  diff: number;
}

// Интерфейс для ответа API
interface CurrencyApiResponse {
  currencies: Currency[];
}

// Кэш для хранения данных валют
const cachedData: { value: CurrencyApiResponse | null; lastFetchTime: Date | null } = {
  value: null,
  lastFetchTime: null,
};

// Обработчик GET-запроса
export async function GET(request: Request): Promise<Response> {
  // Проверяем, нужно ли обновлять кэш
  if (
    !cachedData.value ||
    !cachedData.lastFetchTime ||
    Date.now() - cachedData.lastFetchTime.getTime() > 30 * 60 * 1000
  ) {
    console.log("Attempting to fetch currency data...");
    try {
      const formattedDate = moment().add(1, "days").format("YYYY-MM-DDTHH:mm:ss");
      const url = `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/?date=${formattedDate}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: unknown = await response.json();

      // Проверяем, что данные соответствуют ожидаемой структуре
      if (!Array.isArray(data) || data.length === 0 || !data[0].currencies) {
        throw new Error("Malformed data received from the API");
      }

      // Преобразуем данные в тип CurrencyApiResponse
      const currencyData: CurrencyApiResponse = {
        currencies: data[0].currencies.map((currency: any) => ({
          code: currency.code,
          rateFormated: currency.rateFormated,
          diff: currency.diff,
        })),
      };

      // Обновляем кэш
      cachedData.value = currencyData;
      cachedData.lastFetchTime = new Date();
      console.log("Currency data successfully fetched and cached.");

      // Возвращаем успешный ответ
      return new Response(JSON.stringify(cachedData.value), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching currency data:", error);

      // Возвращаем ответ с ошибкой
      return new Response(
        JSON.stringify({ error: "Currency data is not available yet. Please try again later." }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    console.log("Returning cached currency data.");

    // Явная проверка, что cachedData.value не null
    if (cachedData.value === null) {
      return new Response(
        JSON.stringify({ error: "Currency data is not available yet. Please try again later." }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Возвращаем кэшированные данные
    return new Response(JSON.stringify(cachedData.value), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

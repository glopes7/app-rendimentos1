import { useEffect } from "react";
import { quoteData } from "../utils/quotesData";

export type Quote = {
  currentValue: number;
  currentInvoice: number;
  gains: number;
  leftover: number;
  numQuote: number;
};

type QuoteBoxProps = {
  quote: Quote;
  available: number;
  onQuoteChange: (newValue: Partial<Quote>) => void;
};

export function QuoteBox({ quote, available, onQuoteChange }: QuoteBoxProps) {
  const notEnoughMoney = available < quote.currentValue;

  return (
    <div
      className={`card w-96 shadow-xl ${
        notEnoughMoney ? "bg-red-900" : "bg-base-100 "
      }`}
    >
      <div className=" card-body">
        Disponibilizado: R$ {available.toFixed(2)} <br /> Sobra: R${" "}
        {quote.leftover.toFixed(2)}
        <div className="flex justify-between items-center gap-x-2">
          <select
            className="select w-44"
            onChange={async (e) => {
              const value = e.target.value;
              const quoteId = value.split("-")[0].trim().toLowerCase();

              const result = await fetch(
                `https://rendimentos.deno.dev/${quoteId}`
              );
              const data = await result.json();

              const numQuote = Number(
                Math.trunc(available / data.currentValue)
              );
              const gains = Number(numQuote * data.currentInvoice);
              const leftover = Number(
                Math.abs(numQuote * data.currentValue - available)
              );

              onQuoteChange({ ...data, gains, leftover, numQuote });
            }}
            defaultValue="Escolha uma ação"
          >
            <option disabled>Escolha uma ação</option>
            {quoteData.map((quote, index) => (
              <option key={index}>{quote}</option>
            ))}
          </select>
          <div className="flex flex-col">
            <div className="form-control items-center w-32">
              <label className="label">
                <span className="label-text font-inter font-extralight">
                  Quantidade de Cotas
                </span>
              </label>
              <input
                placeholder="Quantidade"
                type="number"
                className=" input input-sm input-bordered w-32 py-4 "
                disabled
                value={quote.numQuote === Infinity ? 0 : quote.numQuote}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label>Valor da Cota</label>
          <label className="w-auto input-group">
            <input
              className=" input input-sm input-bordered w-20"
              type="number"
              value={quote.currentValue}
              onChange={(e) =>
                onQuoteChange({ currentValue: parseFloat(e.target.value) })
              }
            />
            <span className="bg-primary">R$</span>
          </label>
        </div>
        <div className="flex justify-between items-center">
          <label>Ultimo Rendimento</label>
          <label className="w-auto input-group">
            <input
              className=" input input-sm input-bordered w-20"
              type="number"
              value={quote.currentInvoice}
              onChange={(e) =>
                onQuoteChange({ currentInvoice: parseFloat(e.target.value) })
              }
            />
            <span className=" bg-primary">R$</span>
          </label>
        </div>
        <div
          className={`${
            Boolean(quote.gains) ? "" : "invisible"
          } text-green-500`}
        >
          Ganhos: R$ {quote.gains.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import Konto from "../Konto";
import KontoFetch from "../KontoFetch";

jest.mock("../KontoFetch");

let mockGetGuthaben;
let mockGetName;

beforeEach(() => {
  mockGetGuthaben = jest.fn();
  mockGetName = jest.fn();

  KontoFetch.mockImplementation(() => ({
    getGuthaben: mockGetGuthaben,
    getName: mockGetName,
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Konto-Komponente", () => {
  test("rendert die Begrüßung und das Guthaben korrekt", async () => {
    mockGetGuthaben.mockResolvedValueOnce(1000);
    mockGetName.mockResolvedValueOnce("Max Mustermann");

    render(<Konto />);

    expect(screen.getByText(/Willkommen/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Willkommen Max Mustermann/i)).toBeInTheDocument();
      expect(screen.getByText(/1000 \$/i)).toBeInTheDocument();
    });
  });

  test("zeigt eine Fehlermeldung an, wenn die API-Aufrufe fehlschlagen", async () => {
    mockGetGuthaben.mockRejectedValueOnce(new Error("Fehler beim Abrufen des Guthabens"));
    mockGetName.mockRejectedValueOnce(new Error("Fehler beim Abrufen des Namens"));

    render(<Konto />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler:/i)).toBeInTheDocument();
    });
  });

  test("wendet die richtige CSS-Klasse für positive Guthaben an", async () => {
    mockGetGuthaben.mockResolvedValueOnce(1000);
    mockGetName.mockResolvedValueOnce("Max Mustermann");

    render(<Konto />);

    await waitFor(() => {
      const guthabenElement = screen.getByText(/1000 \$/i);
      expect(guthabenElement).toHaveClass("positive-change");
    });
  });

  test("wendet die richtige CSS-Klasse für negatives Guthaben an", async () => {
    mockGetGuthaben.mockResolvedValueOnce(-500);
    mockGetName.mockResolvedValueOnce("Max Mustermann");

    render(<Konto />);

    await waitFor(() => {
      const guthabenElement = screen.getByText(/-500 \$/i);
      expect(guthabenElement).toHaveClass("negative-change");
    });
  });

  test("wendet keine spezielle CSS-Klasse für null Guthaben an", async () => {
    mockGetGuthaben.mockResolvedValueOnce(0);
    mockGetName.mockResolvedValueOnce("Max Mustermann");

    render(<Konto />);

    await waitFor(() => {
      const guthabenElement = screen.getByText(/0 \$/i);
      expect(guthabenElement).not.toHaveClass("positive-change");
      expect(guthabenElement).not.toHaveClass("negative-change");
    });
  });
  
});

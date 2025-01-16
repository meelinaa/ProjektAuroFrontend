import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Transaktionen from '../Transaktionen';
import TransaktionenFetch from '../TransaktionenFetch';

jest.mock('../TransaktionenFetch');

let mockGetAlleTransaktionen;

beforeEach(() => {
    mockGetAlleTransaktionen = jest.fn();
    TransaktionenFetch.mockImplementation(() => ({
        getAlleTransaktionen: mockGetAlleTransaktionen,
    }));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Transaktionen-Komponenten', () => {
    
    test('Transaktionen-Komponente rendert korrekt', () => {
        render(<Transaktionen />);
        expect(screen.getByText(/Deine Transaktionen/i)).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('Zeigt Daten nach erfolgreichem Fetch', async () => {
        const mockResponse = [
            {
                id: 'AAPL',
                orderType: 'buy',
                aktienName: 'Apple',
                orderDateAndTime: '2023-12-31T23:59:59Z',
                buySellKurs: 150,
                aktie_anteile: 10,
            },
            {
                id: 'GOOGL',
                orderType: 'sell',
                aktienName: 'Google',
                orderDateAndTime: '2023-12-30T23:59:59Z',
                buySellKurs: 200,
                aktie_anteile: 5,
            },
        ];

        mockGetAlleTransaktionen.mockResolvedValueOnce(mockResponse);

        render(<Transaktionen />);

        await waitFor(() => {
            expect(screen.getByText(/buy/i)).toBeInTheDocument();
            expect(screen.getByText(/Apple/i)).toBeInTheDocument();
            expect(screen.getByText('150.00 $')).toBeInTheDocument();
            expect(screen.getByText(/31.12.2023, 23:59/i)).toBeInTheDocument();
            expect(screen.getByText(/sell/i)).toBeInTheDocument();
            expect(screen.getByText(/Google/i)).toBeInTheDocument();
            expect(screen.getByText('200.00 $')).toBeInTheDocument();
            expect(screen.getByText(/31.12.2023, 23:59/i)).toBeInTheDocument();
        });
    });

    test('Zeigt Fehlermeldung bei fehlgeschlagenem Abruf', async () => {
        mockGetAlleTransaktionen.mockRejectedValueOnce(new Error('Fehler beim Abrufen der Daten'));

        render(<Transaktionen />);

        await waitFor(() => {
            expect(screen.getByText(/Fehler:/i)).toBeInTheDocument();
            expect(screen.getByText(/Fehler beim Abrufen der Daten/i)).toBeInTheDocument();
        });
    });

    test('Zeigt Details an, wenn eine Transaktion ausgewählt wird', async () => {
        const mockResponse = [
            {
                id: 'AAPL',
                orderType: 'buy',
                aktienName: 'Apple',
                orderDateAndTime: '2023-12-31T23:59:59Z',
                buySellKurs: 150,
                aktie_anteile: 10,
            },
        ];

        mockGetAlleTransaktionen.mockResolvedValueOnce(mockResponse);

        render(<Transaktionen />);

        await waitFor(() => {
            const row = screen.getByText(/Apple/i).closest('tr');
            fireEvent.click(row);
        });

        await waitFor(() => {
            const elements = screen.getAllByText(/buy/i);
            const infoElement = elements.find((el) => el.tagName === 'TD'); // Wähle das <td>-Element aus
            expect(infoElement).toBeInTheDocument();
        });
    });

});

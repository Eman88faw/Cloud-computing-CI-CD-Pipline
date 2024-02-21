import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  // Mock global fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ todo_list: [] }),
    })
  );

  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/To Do List/i)).toBeInTheDocument();
  });

  it('fetches todos on component mount', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});

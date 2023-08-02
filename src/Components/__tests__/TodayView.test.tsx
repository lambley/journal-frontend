import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { TodayView } from "../TodayView";

jest.mock("../../Api/Api.js", () => ({
  axiosInstance: {
    get: jest.fn(() => Promise.resolve({
      data: [
        {
          id: 1,
          title: "Test Post",
          content: "Test Content",
          label: "work",
          created_at: new Date(),
        }
      ]
    })),
  }
}));
describe('TodayView', () => {
  test('TodayView component renders correctly', async () => {
    render(<MemoryRouter><TodayView/></MemoryRouter>);
    await waitFor(() => {
      expect(screen.findByText(/test post/i));
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostList } from '../PostList';
import exp from 'constants';

jest.mock("../../Api/Api.js", () => ({
  axiosInstance: {
    get: jest.fn(() => Promise.resolve({
      data: [
        {
          id: 1,
          title: "Test Post",
          content: "Test Content",
          label: "Test Label",
          created_at: "2021-10-10T20:00:00.000Z",
        }
      ]
    })),
    delete: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
  }
}));

describe('PostList', () => {
  test('renders the post list correctly', async () => {
    render(<PostList />);
    await waitFor(() => {
      expect(screen.getByText(/test post/i)).toBeInTheDocument();
    });
  });

  test('clicking "Create New Post" button toggles the display of the post form', async () => {
    render(<PostList />);
    const createNewPostButton = screen.getByRole('button', { name: /create new post/i });

    // display the post form
    fireEvent.click(createNewPostButton);

    const formHeading = screen.getByRole('heading', { name: /create new post/i });

    await waitFor(() => {
      expect(formHeading).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(formHeading.tagName).toBe('H2');
    });

    // hide the post form
    fireEvent.click(createNewPostButton);

    await waitFor(() => {
      expect(formHeading).not.toBeInTheDocument();
    });
  });
});

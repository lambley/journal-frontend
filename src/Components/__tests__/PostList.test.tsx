import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostList } from '../PostList';

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

  // Edit test

  // Delete test

  test('changing the sort option should re-render the post list', async () => {
    render(<PostList />);
    const sortSelect = screen.getByLabelText('Sort by:');

    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    await waitFor(() => {
      const postTitles = screen.getAllByText(/Test Post/);
      expect(postTitles[0]).toBeInTheDocument();
    });

    fireEvent.change(sortSelect, { target: { value: 'newest' } });
    await waitFor(() => {
      const postTitles = screen.getAllByText(/Test Post/);
      expect(postTitles[0]).toBeInTheDocument();
    });
  });

  test('filtering the post list by search input', async () => {
    render(<PostList />);

    const searchInput = screen.getByLabelText('Search');

    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      const filteredPosts = screen.getAllByText(/Test Post/i);
      expect(filteredPosts[0]).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      const allPosts = screen.queryAllByText(/Test Post/i);
      expect(allPosts[0]).toBeInTheDocument()
    }, { timeout: 500 });
  });
});

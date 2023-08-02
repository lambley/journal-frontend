import React from 'react';
import { render, screen } from '@testing-library/react';
import { Post } from '../Post';
import { IPost } from '../../types/data';
import { MemoryRouter } from 'react-router';

const postMock: IPost = {
  id: 1,
  title: 'Test Post',
  content: 'This is a test post.',
  label: 'work',
  created_at: new Date('2023-07-28T12:34:56'),
};

describe('Post', () => {
  test('Post component renders correctly', () => {
    render(<MemoryRouter><Post {...postMock} /></MemoryRouter>);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post.')).toBeInTheDocument();
    expect(screen.getByText('#work')).toHaveClass('post-label');
    const formattedDate = postMock.created_at?.toString().slice(0, 10);
    expect(screen.getByText(`Added on ${formattedDate}`)).toBeInTheDocument();
  });

  test('Labels have correct class', () => {
    render(<MemoryRouter><Post {...postMock} /></MemoryRouter>);

    expect(screen.getByText('Test Post')).toBeInTheDocument();

    const label = screen.getByText('#work') as HTMLElement;

    expect(label.classList.contains('post-label')).toBe(true);
    expect(label.classList.contains('post-label-work')).toBe(true);
  });
});

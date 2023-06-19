import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import Button from './index';

test('显示默认按钮', () => {
  render(<Button>默认按钮</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('默认按钮');
  expect(button).not.toBeDisabled();
  expect(button).toHaveClass('btn btn-default');
});

test('禁用按钮', () => {
  render(<Button disabled={true} />);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});

test('显示幽灵按钮', () => {
  render(<Button ghost="ghost" />);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('btn ghost');
});

test('显示超链接按钮', () => {
  render(<Button href="#" btnType="link" />);
  const button = screen.getByRole('link');
  expect(button).not.toBeDisabled();
  expect(button).toHaveClass('btn btn-link');
  expect(button).toHaveAttribute('href');
});

test('加载状态按钮', () => {
  let loading = true;
  render(<Button loading={loading} />);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
  screen.debug();
  loading = false;
  expect(button).not.toBeDisabled();
});

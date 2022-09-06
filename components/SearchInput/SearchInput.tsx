import { Input, InputProps } from 'antd';
import { FC } from 'react';
import c from 'classnames';
import * as style from './SearchInput.css';
import SearchIcon from '../../icons/SearchIcon';

const SearchInput: FC<InputProps> = props => {
  const { className } = props;
  return (
    <Input
      {...props}
      className={c(style.searchInput, className)}
      prefix={<SearchIcon />}
    />
  );
};

export default SearchInput;

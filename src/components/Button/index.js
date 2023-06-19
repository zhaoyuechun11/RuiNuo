import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import style from './index.less';

const ButtonSize = {
  Large: 'lg',
  Small: 'sm',
};

const ButtonType = {
  Default: 'default',
  Info: 'info',
  Primary: 'primary',
  Clear: 'clear',
  Danger: 'danger',
  Link: 'link',
};

// interface BaseButtonProps {
//   className?: string;
//   disabled?: boolean;
//   href?: string;
//   size?: ButtonSize;
//   btnType?: ButtonType;
//   children: React.ReactNode;
//   loading?: boolean;
//   ghost?: boolean;
// }

// type NativeButtonProps = BaseButtonProps &
//   React.ButtonHTMLAttributes<HTMLElement>;
// type AnchorButtonProps = BaseButtonProps &
//   React.AnchorHTMLAttributes<HTMLElement>;
//
// export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

/**
 * 建立绑定关系
 */
let cx = classNames.bind(style);

const Button = props => {
  const {
    btnType,
    className,
    disabled,
    size,
    href,
    loading,
    ghost,
    children,
    ...restProps
  } = props;
  // btn, btn-lg, btn-primary
  const classes = cx('btn', className, {
    [`ghost`]: ghost,
    [`btn-loading`]: loading,
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: btnType === ButtonType.Link && disabled,
  });
  if (btnType === ButtonType.Link && href) {
    return (
      <a href={href} className={classes} {...restProps}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} disabled={disabled || loading} {...restProps}>
      {loading ? <LoadingOutlined style={{ marginRight: 10 }} /> : null}
      {children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  btnType: ButtonType.Default,
};

export default Button;

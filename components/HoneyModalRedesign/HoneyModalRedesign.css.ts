import { globalStyle, style } from '@vanilla-extract/css';

export const closeIcon = style({
  background: 'url("/images/close-notification-icon.svg") center center no-repeat',
  transform: 'translate(15px, 15px)',
  width: 16,
  height: 16,
})

export const honeyModal = style({})

export const modalContentWrapper = style({
  padding: 12,
})

globalStyle(`${honeyModal} .ant-modal-body`, {
  padding: 0,
})

globalStyle(`${honeyModal} .ant-modal-content`, {
  borderRadius: 15,
})
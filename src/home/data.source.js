import React from 'react';
export const Banner20DataSource = {
  wrapper: { className: 'banner2' },
  BannerAnim: {
    children: [
      {
        name: 'elem0',
        BannerElement: { className: 'banner-user-elem' },
        page: { className: 'home-page banner2-page' },
        textWrapper: { className: 'banner2-text-wrapper' },
        bg: { className: 'bg bg0' },
        title: {
          className: 'banner2-title',
          children: (
            <span>
              <p>MISP</p>
            </span>
          ),
        },
        content: {
          className: 'banner2-content',
          children: (
            <span>
              <span>
                <p>只需一台普通的笔记本电脑</p>
              </span>
            </span>
          ),
        },
        button: { className: 'banner2-button', children: 'Learn More' },
      },
    ],
  },
};

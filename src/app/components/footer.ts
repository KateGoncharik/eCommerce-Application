import { el } from 'redom';
import logo from '@icons/logo.png';
import githubIcon from '@icons/github.svg';
import { Route } from '@customTypes/route';

class Footer {
  public create(): HTMLElement {
    return el('footer.footer', [
      el('.footer-top', [
        el('.footer-logo', el('img', { src: logo, alt: 'Logo' })),
        el('nav.footer-nav', [
          el('a.footer-nav-link', 'Home', {
            href: Route.Main,
            'data-navigo': '',
          }),
          el('a.footer-nav-link', 'Catalog', {
            href: Route.Catalog,
            'data-navigo': '',
          }),
          el('.footer-nav-link', 'About Us'),
          el('a.footer-nav-link', 'Cart', {
            href: Route.CartPage,
            'data-navigo': '',
          }),
        ]),
        el('.footer-github', [
          el('img.footer-github-icon', { src: githubIcon, alt: '' }),
          el('.footer-github-links', [
            el('a.footer-github-link', 'Irina-Grebennikova', {
              href: 'https://github.com/Irina-Grebennikova',
              target: '_blank',
            }),
            el('a.footer-github-link', 'KateGoncharik', {
              href: 'https://github.com/KateGoncharik',
              target: '_blank',
            }),
            el('a.footer-github-link', 'laleks6', {
              href: 'https://github.com/laleks6',
              target: '_blank',
            }),
          ]),
        ]),
      ]),
      el('.footer-bottom', [
        el('p.footer-copyright', '© 2023'),
        el('a.footer-rss-link', 'RS School.', {
          href: 'https://rs.school/index.html',
          target: '_blank',
        }),
        el('p.footer-team', 'Created by BugBusters team.'),
      ]),
    ]);
  }
}

export { Footer };

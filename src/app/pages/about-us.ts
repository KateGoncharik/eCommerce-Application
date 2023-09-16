import { Page } from '@templates/page';
import { el } from 'redom';
import avatar from '@icons/avatar_test.jpg';
// import gitIcon from '@icons/git_icon.png'
export class AboutUs extends Page {
  constructor() {
    super();
  }

  protected textObject = {
    title: 'About us',
  };

  private createBlockAboutUs(): HTMLElement {
    const blockAboutUs = el('.block-about-us', [
      el('.card', [
        el('img.card-img', { src: avatar }),
        el('block-info', [
          el('h4.card-name', 'Lomanov Aleksandr'),
          el('p.card-roles', 'Student developer'),
          el(
            'p.description-card',
            'fjakfjawfjwa ifjawkfja lfkjafk lsja ksfljaklaafjajwfji3j 39qjfafja fajfiajfaw faijfaf fla,f a f,alfaf fla;f alfkalf aflakfa fkalf; kaf;l ka;f ka;f akf ;afk al;f '
          ),
          el('.card-links', [
            el('a.card-cv-link', 'More about me'),
            el('a.card-git-link', 'Link github', { href: 'https://github.com/', target: '_blank' }),
          ]),
        ]),
      ]),
      el('.card', [
        el('img.card-img', { src: avatar }),
        el('block-info', [
          el('h4.card-name'),
          el('span.card-roles'),
          el('p.card-description'),
          el('.card-links', [el('a.card-git-link', [el('img.icon-git')]), el('a.card-cv-link')]),
        ]),
      ]),
      el('.card', [
        el('img.card-img', { src: avatar }),
        el('block-info', [
          el('h4.card-name'),
          el('span.card-roles'),
          el('p.card-description'),
          el('.card-links', [el('a.card-git-link', [el('img.icon-git')]), el('a.card-cv-link')]),
        ]),
      ]),
    ]);
    return blockAboutUs;
  }

  protected build(): HTMLElement {
    return this.createBlockAboutUs();
  }
}

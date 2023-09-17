import { Page } from '@templates/page';
import { el } from 'redom';
import avatarA from '@icons/avatar_a.jpg';
import avatarI from '@icons/avatar_i.jpg';
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
      el('about-us-description', 'afafafa'),
      el('.about-us', [
        el('.card', [
          el('.block-card-img', [el('img.card-img', { src: avatarA })]),
          el('.block-info', [
            el('h4.info-name', 'ALEKSANDR'),
            el('p.card-roles', 'STUDENT DEVELOPER'),
            el(
              'p.description-card',
              'fjakfjawfjwa ifjawkfja lfkjafk lsja ksfljaklaafjajwfji3j 39qjfafja fajfiajfaw faijfaf fla,f a f,alfaf fla;f alfkalf aflakfa fkalf; kaf;l ka;f ka;f akf ;afk al;f '
            ),
            el('.card-links', [
              el('a.card-cv-link', 'More about me'),
              el('a.card-git-link', 'Github', { href: 'https://github.com/', target: '_blank' }),
            ]),
          ]),
        ]),
        el('.card', [
          el('.block-card-img', [el('img.card-img', { src: avatarI })]),
          el('.block-info', [
            el('h4.info-name', 'IRINA'),
            el('p.card-roles', 'STUDENT DEVELOPER'),
            el(
              'p.description-card',
              'fjakfjawfjwa ifjawkfja lfkjafk lsja ksfljaklaafjajwfji3j 39qjfafja fajfiajfaw faijfaf fla,f a f,alfaf fla;f alfkalf aflakfa fkalf; kaf;l ka;f ka;f akf ;afk al;f '
            ),
            el('.card-links', [
              el('a.card-cv-link', 'More about me'),
              el('a.card-git-link', 'Github', { href: 'https://github.com/', target: '_blank' }),
            ]),
          ]),
        ]),
        el('.card', [
          el('.block-card-img', [el('img.card-img', { src: avatarA })]),
          el('.block-info', [
            el('h4.info-name', 'KATE'),
            el('p.card-roles', 'STUDENT DEVELOPER'),
            el(
              'p.description-card',
              'fjakfjawfjwa ifjawkfja lfkjafk lsja ksfljaklaafjajwfji3j 39qjfafja fajfiajfaw faijfaf fla,f a f,alfaf fla;f alfkalf aflakfa fkalf; kaf;l ka;f ka;f akf ;afk al;f '
            ),
            el('.card-links', [
              el('a.card-cv-link', 'More about me'),
              el('a.card-git-link', 'Github', { href: 'https://github.com/', target: '_blank' }),
            ]),
          ]),
        ]),
      ]),
    ]);
    return blockAboutUs;
  }

  protected build(): HTMLElement {
    return this.createBlockAboutUs();
  }
}

import { Page } from '@templates/page';
import { el } from 'redom';
import iconRS from '@icons/icon_rs.svg';
import avatarA from '@icons/avatar_a.jpg';
import avatarI from '@icons/avatar_i.jpg';
import avatarK from '@icons/avatar_k.jpg';

export class AboutUs extends Page {
  constructor() {
    super();
  }

  protected textObject = {
    title: 'About us',
  };

  private createBlockAboutUs(): HTMLElement {
    const blockAboutUs = el('.block-about-us', [
      el('.about-us-description', [
        el('p.wonderland-description', [
          el('span.bold-descriptin', 'Wonderland'),
          el('span', ' - online store for modern, stylish party decorations and supplies.'),
        ]),
        el(
          '.main-description',
          `Users can browse through our products, view detailed descriptions, add favorite items to the basket, and proceed to checkout. 
        It includes features such as user registration and login, product search, product categorization, and sorting to make the shopping experience more streamlined and convenient. 
        An important aspect of our application is that it's responsive, ensuring it looks great on various devices with a minimum resolution of 390px. 
        This feature makes the shopping experience enjoyable, irrespective of the device users prefer.`
        ),
      ]),
      el('.about-us-card', [
        el('.block-about-us-entry', [
          el('span.about-us-entry', 'Student team'),
          el('a.link-rs', { href: 'https://rs.school/', target: '_blank' }, [el('img.icon-rs', { src: iconRS })]),
        ]),
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
              el('a.card-cv-link', 'More about me', {
                href: 'https://laleks6.github.io/rsschool-cv/cv',
                target: '_blank',
              }),
              el('a.card-git-link', 'Github', { href: 'https://github.com/laleks6', target: '_blank' }),
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
              el('a.card-git-link', 'Github', { href: 'https://github.com/Irina-Grebennikova', target: '_blank' }),
            ]),
          ]),
        ]),
        el('.card', [
          el('.block-card-img', [el('img.card-img', { src: avatarK })]),
          el('.block-info', [
            el('h4.info-name', 'KATE'),
            el('p.card-roles', 'STUDENT DEVELOPER'),
            el(
              'p.description-card',
              'fjakfjawfjwa ifjawkfja lfkjafk lsja ksfljaklaafjajwfji3j 39qjfafja fajfiajfaw faijfaf fla,f a f,alfaf fla;f alfkalf aflakfa fkalf; kaf;l ka;f ka;f akf ;afk al;f '
            ),
            el('.card-links', [
              el('a.card-cv-link', 'More about me', {
                href: 'https://kategoncharik.github.io/rsschool-cv/cv',
                target: '_blank',
              }),
              el('a.card-git-link', 'Github', { href: 'https://github.com/KateGoncharik', target: '_blank' }),
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

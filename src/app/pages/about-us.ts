import { Page } from '@templates/page';
import { el } from 'redom';
import iconRS from '@icons/icon_rs.svg';
import avatarA from '@icons/avatar_a.jpg';
import avatarI from '@icons/avatar_i.jpg';
import avatarK from '@icons/avatar_k.jpg';

export class AboutUs extends Page {
  protected textObject = {
    title: 'About us',
  };

  constructor() {
    super();
  }

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
        This feature makes the shopping experience enjoyable, irrespective of the device users prefer. `
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
            el('p.tags-card', '✘ Registration Form ✘ Product Page ✘ About Us Page'),
            el(
              'p.description-card',
              `My name is Sasha. I am a frontend student. 
            I graduated from the National University of Science and Technology “MISIS” with a degree in mining engineering. 
            I was born in Kazakhstan but now i live in Moscow. P.S. For the third time I’m trying to pass stage-1, but something is not going according to plan.
            P.P.S Is this some kind of joke???`
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
            el('p.tags-card', '✘ Main Page Enhancements ✘ Routing ✘ Catalog Page ✘ Header ✘ Footer'),
            el(
              'p.description-card',
              `Hello! My name is Irina.
             I've been studying frontend development for a year now. 
             I have experience in developing web projects, single-page applications, and multi-page websites. 
             The scope of  my expertise includes knowledge of HTML, CSS (SASS/SCSS, BEM), JavaScript, TypeScript, Webpack, Commercetools, Git, GitHub, REST API, Async coding, Figma. 
             I am a self-motivated programmer with a strong drive to succeed. I am passionate about coding and continuously strive to enhance my skills and knowledge in the field. 
             I believe in setting high goals for myself and working diligently to achieve them.`
            ),
            el('.card-links', [
              el('a.card-cv-link', 'More about me', {
                href: 'https://www.youtube.com/watch?v=eHz5v3I07zg',
                target: '_blank',
              }),
              el('a.card-git-link', 'Github', { href: 'https://github.com/Irina-Grebennikova', target: '_blank' }),
            ]),
          ]),
        ]),
        el('.card', [
          el('.block-card-img', [el('img.card-img', { src: avatarK })]),
          el('.block-info', [
            el('h4.info-name', 'KATE'),
            el('p.card-roles', 'STUDENT DEVELOPER'),
            el('p.tags-card', '✘ Team Management ✘ Login Form ✘ User Profile Page ✘ Basket Page'),
            el(
              'p.description-card',
              `Hello, my name is Kate Goncharick, and I am a junior frontend developer.
            I am 20 years old and originally from Minsk, Belarus.
            I have been studying at the Belarusian State University of Culture and Arts for three years, but one day I decided to change my specialization.
            Since the summer of 2022, I have been self-studying. 
            My first project was completed through Dmitri Valok's online course. Later, a friend introduced me to Rolling Scopes School, and I joined in the middle of the zero stage. Currently, I am finishing the second stage of the program.
            Most of my life has been connected with art, particularly dancing. 
            Now, I am able to create not only choreography but also write code that looks decent enough. 
            Over the past month, I have been gaining experience in team collaboration, and it has been a really cool experience!`
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

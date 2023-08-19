import '@styles/main.scss';
import { App } from '@app/app';

import { getProject } from '@sdk/test-sdk';
getProject().then().catch(console.error);

const app = new App();
app.run();

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes'; // Corrected import
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor.fn';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES), // Corrected usage
    provideHttpClient(withInterceptors([tokenInterceptor]), withFetch()),
    provideClientHydration(withEventReplay()),
  ],
};

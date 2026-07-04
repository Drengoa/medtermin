import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { Navbar } from './shared/navbar/navbar';

@NgModule({
  declarations: [App, Navbar],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
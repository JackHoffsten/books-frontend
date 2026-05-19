import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  public isDarkMode = signal<boolean>(false); 

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
    this.applyTheme(this.isDarkMode());
  }

  public toggleTheme() {
    this.isDarkMode.update(dark => !dark);
    this.applyTheme(this.isDarkMode());
    localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean) {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}

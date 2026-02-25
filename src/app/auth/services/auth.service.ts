import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private usersKey = 'orgtrix_users';
  private currentUserKey = 'orgtrix_current_user';

  constructor(private router: Router) { }

  //get all users from localStorage
  private getUsers(): User[] {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]')
    console.log('[AuthService] Loaded Users:', users);
    return users;
  }

  //save users to localstorage
  private saveUsers(users: User[]) {
    console.log('[AuthService] Saving Users:', users);
    localStorage.setItem(this.usersKey, JSON.stringify(users))
  }

  //signup

  signup(name: string, email: string, password: string): { success: boolean; message: string } {

    console.log('[AuthService] Signup Attempt:', email);

    const users = this.getUsers()

    //check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) { 
      console.warn('[AuthService] Signup Failed - Email exists');
      return { success: false, message: 'Email already exists!' }; 
    }

    //create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password
    };

    users.push(newUser)
    this.saveUsers(users)
    console.log('[AuthService] Signup Successful:', newUser);
    return { success: true, message: 'Signup successful!' };
  }

  //signin

  signin(email: string, password: string): { success: boolean; message: string } {
    
    console.log('[AuthService] Signin Attempt:', email);

    const users = this.getUsers()

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      console.warn('[AuthService] Signin Failed - Invalid credentials');
      return { success: false, message: 'Invalid email or password!' };
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    console.log('[AuthService] Signin Successful:', user);

    return { success: true, message: 'Login successful!' };
  }

  signout() {
    console.log('[AuthService] User Logged Out');
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/signin']);
  }

  //check login
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  //get current user
  getCurrentUser(): User | null {
    const user = JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
    console.log('[AuthService] Current User:', user);
    return user;
  }

}

import { Injectable, BadRequestException } from '@nestjs/common';

import { User } from '../interfaces';
import { unixTimestamp, validatePhoneNumber } from '../utils';

@Injectable()
export class UserService {
  private readonly _users: User[] = [];

  /**
   * Returns true if the user exists.
   * @param userId - ID of the user to check
   */
  public userExists(userId: string): boolean {
    return this._users.find(u => u.id === userId) !== undefined;
  }

  /**
   * Creates a new user and returns their ID if successful.
   * @param email - User's email address
   * @param password - User's password
   * @param phone - (Optional) user's phone number in the format ###-###-####
   */
  public createUser(email: string, password: string, phone?: string): string {
    if (!email) {
      throw new BadRequestException('Email cannot be blank');
    }

    if (this.emailExists(email)) {
      throw new BadRequestException('Email already in use');
    }

    if (!password) {
      throw new BadRequestException('Password cannot be blank');
    }

    // note: phone number is optional, only validate if supplied
    if (phone && !validatePhoneNumber(phone)) {
      throw new BadRequestException(
        'Phone number must be in format ###-###-####',
      );
    }

    const id = (this._users.length + 1).toString();
    this._users.push({
      id,
      created: unixTimestamp(),
      email,
      password, // TODO: this should be hashed with bcrypt
      phoneNumber: phone || '',
    });

    return id;
  }

  private emailExists(email: string): boolean {
    return this._users.find(u => u.email === email) !== undefined;
  }
}

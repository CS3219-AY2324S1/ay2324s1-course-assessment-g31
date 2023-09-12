import { UUID } from "crypto";
import * as bcrypt from 'bcrypt';
import { parse } from 'uuid';
import db from "../db";

interface User {
    user_id: string;
    account_type: string;
    username: string;
    email: string;
    hashed_pw: string;
}

export const userFunctions = {
    async isEmailTaken(email: string): Promise<boolean> {
        try {
            const user = await db.query('SELECT * FROM public.users WHERE email = $1', [email]);
            if (user.rows.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking if email is taken:', error);
            throw error; 
        }
    },

    async getIdForUserAccountType(): Promise<UUID | null> {
        try {
            const user = await db.query('SELECT * FROM public.account_type WHERE type = $1', ['User']);
        if (user.rows.length > 0) {
            return user.rows[0].type_id;
        } else {
            return null; // Return null if no matching record is found
        }
        } catch (error) {
            console.error('Error getting user account type ID:', error);
            throw error;
        }
    },

    async insertUser(user: {
        user_id: string,
        account_type: string,
        username: string,
        email: string,
        hashed_pw: string
    }): Promise<void> {
        try {
            const query = `
                INSERT INTO public.users (user_id, account_type, username, email, hashed_pw)
                VALUES ($1, $2, $3, $4, $5);
            `;
            const values = [
                user.user_id,
                user.account_type,
                user.username,
                user.email,
                user.hashed_pw,
            ];
            await db.query(query, values);
        } catch (error) {
            console.error('Error inserting user:', error);
            throw error;
        }
    },

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            const queryResult = await db.query<User>('SELECT * FROM public.users WHERE email = $1', [email]);
            
            if (queryResult.rows && queryResult.rows.length > 0) {
                const user = queryResult.rows[0];
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    },

    async getUserById(id: string): Promise<User | null> {
        try {
            const uuidConvert = parse(id);
            const queryResult = await db.query<User>('SELECT * FROM public.users WHERE user_id = $1', [uuidConvert]);
            
            if (queryResult.rows && queryResult.rows.length > 0) {
                const user = queryResult.rows[0];
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching user by id:', error);
            throw error;
        }
    },

    async deleteUserById(id: string): Promise<void> {
        try {
            const uuidConvert = parse(id);
            const deleteResult = await db.query('DELETE FROM public.users WHERE user_id = $1', [uuidConvert]);

            if (deleteResult.rowCount === 0) {
                throw new Error('User not found.');
            }
            console.log("User has been deleted from query");
        } catch (error) {
            console.error('Error deleting user by id:', error);
            throw error;
        }
    },

    async updateUserProfile(id: string, email: string, username: string): Promise<void> {
        try {
            const uuidConvert = parse(id);
            const updateResult = await db.query(
            'UPDATE public.users SET email = $2, username = $3 WHERE user_id = $1',
            [uuidConvert, email, username]
            );
            if (updateResult.rowCount === 1) {
            console.log('Profile updated successfully');
            } else {
            console.error('User not found or profile update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    async changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
        try {
            const user = await this.getUserById(id);

            if (!user) {
                throw new Error("User not found");
            }

            const passwordMatch = await bcrypt.compare(oldPassword, user.hashed_pw);

            if (!passwordMatch) {
                throw new Error("Old password is incorrect");
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 8);
            const updateResult = await db.query(
                'UPDATE public.users SET hashed_pw = $2 WHERE user_id = $1',
                [user.user_id, newPasswordHash]);
            
            if (updateResult.rowCount === 1) {
            console.log('Password changed successfully');
            } else {
            console.error('User not found or password change failed');
            }

        } catch (error) {
            console.error("Error changing password: ", error);
            throw error;
        }
    }
};

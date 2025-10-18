export class UserModel {
    constructor(
        public fullname: string = '',
        public gender: string = '',
        public username: string = '',
        public status: string = 'Active'
    ) {}
}
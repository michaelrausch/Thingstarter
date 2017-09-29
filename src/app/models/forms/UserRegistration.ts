export class UserRegistration {
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public location: string
    ){}

    asJson(){
        return {
            "username": this.username,
            "password": this.password,
            "email": this.email,
            "location": this.location
        }
    }
}
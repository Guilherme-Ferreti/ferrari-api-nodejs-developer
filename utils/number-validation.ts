import { BadRequestException } from "@nestjs/common";

export const isValidNumber = (number: number) => {
    number = Number(number);

    if (isNaN(number)) {
        throw new BadRequestException('Number is invalid.');
    }

    return number;
}
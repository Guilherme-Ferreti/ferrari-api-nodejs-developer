import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { columnCreatedAt, columnId, columnUpdatedAt, columnVarchar } from "../columns";

export class PaymentSituations1645657847335 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'payment_situations',
            columns: [
                columnId,
                columnVarchar('name', '45', true),
                columnCreatedAt,
                columnUpdatedAt,
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('payment_situations');
    }

}

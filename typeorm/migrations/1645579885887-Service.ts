import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { columnCreatedAt, columnId, columnUpdatedAt } from "../columns";

export class Service1645579885887 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'services',
            columns: [
                columnId,
                {
                    name: 'name',
                    type: 'varchar',
                    length: '45',
                },
                {
                    name: "description",
                    type: 'mediumtext',
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                columnCreatedAt,
                columnUpdatedAt,
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('services');
    }

}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { columnCreatedAt, columnId, columnUpdatedAt, columnVarchar } from "../columns";

export class Addresses1645653636047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'addresses',
            columns: [
                columnId,
                columnVarchar('street', '191'),
                columnVarchar('number', '16', true),
                columnVarchar('complement', '191', true),
                columnVarchar('district', '191'),
                columnVarchar('city', '191'),
                columnVarchar('state', '191'),
                columnVarchar('country', '191'),
                columnVarchar('zipcode', '191'),
                {
                    name: 'personId',
                    type: 'int'
                },
                columnCreatedAt,
                columnUpdatedAt,
            ],
        }));

        await queryRunner.createForeignKey('addresses', new TableForeignKey({
            columnNames: ['personId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'persons',
            name: 'FK_addresses_persons',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('addresses');
    }

}

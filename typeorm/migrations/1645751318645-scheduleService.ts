import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { columnCreatedAt, columnUpdatedAt } from "../columns";

export class scheduleService1645751318645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'schedule_services',
            columns: [
                {
                    name: 'scheduleId',
                    type: 'int',
                    isPrimary: true,
                }, 
                {
                    name: 'serviceId',
                    type: 'int',
                    isPrimary: true,
                },
                columnCreatedAt,
                columnUpdatedAt,
            ],
        }));

        await queryRunner.createForeignKey('schedule_services', new TableForeignKey({
            columnNames: ['scheduleId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'schedules',
            onDelete: 'CASCADE',
            name: 'FK_schedules_schedule_services',
        }));

        await queryRunner.createForeignKey('schedule_services', new TableForeignKey({
            columnNames: ['serviceId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'services',
            onDelete: 'CASCADE',
            name: 'FK_services_schedule_services',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('schedule_services', 'FK_schedules_schedule_services');
        await queryRunner.dropForeignKey('schedule_services', 'FK_services_schedule_services');

        await queryRunner.dropTable('schedule_services');
    }

}

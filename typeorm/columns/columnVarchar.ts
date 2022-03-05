import { TableColumnOptions } from 'typeorm';

export function columnVarchar(name: string = 'name', length: string = '255', isNullable: boolean = false) {
    return {
        name,
        type: 'varchar',
        length,
        isNullable,
    } as TableColumnOptions;
}

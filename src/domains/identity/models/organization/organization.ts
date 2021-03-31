import { DataTypes, Model, Sequelize } from 'sequelize';

class Organization extends Model {
    public id: string;
    public name: string;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date;
}

const attributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    }
};

const initOrganization = (sequelize: Sequelize): void => {
    Organization.init(attributes, {
        sequelize,
        tableName: 'organization',
        timestamps: true
    });
};

export { Organization, initOrganization };

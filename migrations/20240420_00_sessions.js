const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "disabled", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valid_until: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(`
      CREATE FUNCTION updateUserStatus() RETURNS TRIGGER AS $updateStatus$
        BEGIN
          IF (TG_OP = 'INSERT') THEN
              UPDATE users
              SET disabled = false
              WHERE users.id = NEW.user_id;
          ELSE
              UPDATE users
              SET disabled = true
              WHERE users.id = OLD.user_id;
          END IF;
          RETURN NULL;
        END;
      $updateStatus$ LANGUAGE plpgsql;

      CREATE TRIGGER updateUser
        AFTER INSERT OR DELETE ON sessions
          FOR EACH ROW
            EXECUTE PROCEDURE updateUserStatus();
      `);
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER updateUser ON sessions;
      DROP FUNCTION updateUserStatus();
    `);
    await queryInterface.dropTable("sessions");
    await queryInterface.removeColumn("users", "disabled");
  },
};

module.exports = {
  host: 'localhost',
  username: 'pguser',
  password: 'pguser',
  database: 'nodeauth',
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}

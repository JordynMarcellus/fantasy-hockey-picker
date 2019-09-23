const { dbConnector } = require("../../db/db");
const sql = require("sql-template-strings");
// filter by: position
// AND position = ANY('{RD,C,LW}')
const defaultSort = sql` ORDER BY rating desc LIMIT 25`;

const buildQuery = (queryObject = {}) => {
  const { filter, sort } = queryObject;
  const query = sql`SELECT * from public.players`;
  query.append(sql` WHERE selected = 'false'`);
  if (Object.keys(queryObject).length === 0) {
    query.append(defaultSort);
    return query;
  }

  // validation would be nice here >.>
  if (filter) {
    // we need to specify it's a text array 🤓
    const filterArray = filter.split(",");
    query.append(sql` AND position = ANY (${filterArray}::text[])`);
  }

  // query.append(
  //   sql` ORDER BY rating ${sort ? `${sort.toLowerCase()}` : "desc"} LIMIT 25`
  // );
  return query;
};

exports.getPlayersController = async (req, res) => {
  const { query } = req;
  console.log(query);
  const builtQuery = buildQuery(query);
  console.log(builtQuery);
  try {
    const { rows } = await dbConnector
      .query(builtQuery)
      .then(res => res)
      .catch(e => {
        throw e;
      });
    return res.status(200).send(rows);
  } catch (e) {
    console.error("error executing query", e.stack);
    return res.status(500).send();
  }
};

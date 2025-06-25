export const resolvers = {
    Query: {
      organizations: async (_, _args, { db, userId }) => {
        const orgs = await db('user_organizations')
  .join('organizations', 'user_organizations.organization_id', 'organizations.id')
  .select('organizations.*', 'user_organizations.role')
  .where('user_organizations.user_id', userId);
  return orgs
      }
    },
    Mutation: {
      createOrganization: async (_, { name }, { db }) => {
          const [organization] = await db("organizations")
              .insert({ name })
              .returning(["id", "name"]); 
           
              await db('user_organizations').insert({
            user_id: 1,
            organization_id: organization.id,
            role: 'admin'
          });
          return organization;
      }
  }
  };
  
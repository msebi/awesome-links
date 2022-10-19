// context has context info about a query or mutation
export const resolvers = {
    Query: {
        links: async (_parent, _args, context) => await context.prisma.link.findMany(),
    }
}


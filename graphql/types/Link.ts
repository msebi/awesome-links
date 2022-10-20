import { nonNull, objectType, stringArg, extendType } from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.string('id');
        t.int('index');
        t.string('title');
        t.string('url');
        t.string('description');
        t.string('imageUrl');
        t.string('category');
    },
});

export const LinksQuery = extendType({
    type: 'Query',
    definition(t) {
        t.connectionField('links', {
            type: Link,
            resolve: async (_, { after, first }, ctx) => {
                const offset = after ? cursorToOffset(after) + 1 : 0;
                if (isNaN(offset)) throw new Error('cursor is invalid');

                const [totalCount, items] = await Promise.all([
                    ctx.prisma.link.count(),
                    ctx.prisma.link.findMany({
                        take: first,
                        skip: offset,
                    }),
                ]);

                return connectionFromArraySlice(
                    items,
                    { first, after },
                    { sliceStart: offset, arrayLength: totalCount }
                );
            },
        });
    },
});

export const CreateLinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createLink', {
            type: Link,
            args: {
                title: nonNull(stringArg()),
                url: nonNull(stringArg()),
                imageUrl: nonNull(stringArg()),
                category: nonNull(stringArg()),
                description: nonNull(stringArg()),
            },
            resolve: async (_parent, args, context) => {

                if (!context.user) {
                    throw new Error(`You need to be logged in to perform an action`)
                }

                const user = await context.prisma.user.findUnique({
                    where: {
                        email: context.user.email,
                    }
                })

                if (user.role !== 'ADMIN') {
                    throw new Error('You don\'t have permission to perform action')
                }

                const newLink = {
                    title: args.title,
                    url: args.url,
                    imageUrl: args.imageUrl,
                    category: args.category,
                    description: args.description,
                }

                return await context.prisma.link.create({
                    data: newLink,
                })
            },
        })
    },
})
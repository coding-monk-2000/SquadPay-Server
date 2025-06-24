export const resolvers = {
    Query: {
      books: (parent, args, contextValue) => {
        return [
          { title: "title1", author: "author1" },
          { title: "title2", author: "author2" },
          { title: "title3", author: "author3" }
        ];
      }
    }
  };
  
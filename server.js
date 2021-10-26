const express = require('express');
const express_graphql = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

// Create GraphQL Schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String, title: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String): Course
        createCourse(courseInput: CourseInput!): [Course]
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
    input CourseInput {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

// data set mock as an array of Course
const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    },
];


// Resolvers

const getCourse = (args) => {
    return coursesData.find(course => parseInt(course.id) === parseInt(args.id));
}

const getCourses = (args) => {
    if(!args.topic && !args.title) {
        return coursesData;
    } else if(args.topic && args.title) {
        return coursesData.filter(course => course.topic === args.topic && course.title === args.title);
    } else if(args.topic) {
        return coursesData.filter(course => course.topic === args.topic);
    } else if (args.title) {
        return coursesData.filter(course => course.title === args.title);
    }
}

const updateCourseTopic = ({id, topic}) => {
 coursesData.map(course => {
     if(id == course.id) {
        course.topic = topic;
     }
     return course
 });
 return coursesData.find(course => course.id == id);
}

const createCourse = ({ courseInput }) => {
    coursesData.push(courseInput);
    return coursesData;
}

// Root
const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
    createCourse: createCourse,
}

// Create GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => console.log('Express/GraphQL server is running on port 4000'));
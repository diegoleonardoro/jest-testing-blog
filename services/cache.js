const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);


const exec = mongoose.Query.prototype.exec;// this stores a reference to the original exec function.


// All the queries inherit from the Query.prototype, so if we add on additional function to the prototype object, then they will be available to any query that we create inside of our application 

// We want to add a cache function to we can cache only the queries that we want

// every time we use the cache function, we should pass an 'options' object with a key property
mongoose.Query.prototype.cache = function (options = {}) {

    this.useCache = true;

    // Every time we use use the cache function on mogoose queries, we need to specify some top level hash key. 
    this.hashKey = JSON.stringify(options.key || '');

    // this refers to the the query object and we have to return it so it can be chainable.
    return this;
    
}



// here we are editing the mongoose.Query.prototype.exec function
mongoose.Query.prototype.exec = async function () {

    // if an user makes an update we need to stop serving them data from the cache

    // if useCache is set to false, then return the original exec function
    if (!this.useCache) {
        return exec.apply(this, arguments)
    }


    // Object.assign is used to safely copy properties from one object to another. The first argument is the object we are copying to.
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    })
    )


    // See if we have a value for "key" in Redis 
    // We use hget (instead of get ) to get a nested hash
    const cacheValue = await client.hget(this.hashKey, key);


    // If we do, return that value
    if (cacheValue) {

        // everything that comes out of Redis is in JSON form so we need to we need to parse before we return it from this caching function 

        // the exec document expects us to return Mongoose model, and JSON.parse(cacheValue) is an object.

        // the query has a property called 'model', which is a reference to the model class that is tied to the query that we are executing, and it is the base class for any mongoose model.

        // the following will transform the redis object into a mongoose model

        // we need to do something slightly different depending upon whether or not we are attempting to deal with an array of records or a single record 

        const doc = JSON.parse(cacheValue);


        //if doc is an array of values, we need to iterate each value and convert it inot a model:
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc)// if doc is not an array 
    }


    // WHEN WE DO NOT HAVE INFORMATION STORED IN REDIS:

    // Otherwise, issue the query and STORE THE RESULT IN REDIS.
    const result = await exec.apply(this, arguments);// this represents a Mongoose document, which we cannot use to store in redis because in this case it needs to be in JSON format


    //hset (instead of set) is used to set a hashed key
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);


    // just adding ('EX', 10) does not solve the challenge of having a user add a new blog post and make it appear next time the user makes a request to see all his blog posts before 10 seconds of the blog post having been created. 

    // To solve this, we are going to store all of the data for each user in separate nested hashes:

    // user_id_1 (key) --> ( nested key: query key --> nested value: result of query)

    // With this new set up, every time a user creates a new blog post, we can look at all the keys that are associated with the user who just created that blog post, and blow away all the nested values that are associates to that user. 


    return result;

}



// The purpose of the clearHash function is going to be to delete the data that is nested on a particular hash. 
module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}

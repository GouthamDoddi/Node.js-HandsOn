module.exports = {
    create (req, res) {
        NamedNodeMap.bind.create(req.body.dbname, err => {
            if (err)
                res.send('Error creating the Database');
        });
        res.send('Database created sucessfully');
    },
};

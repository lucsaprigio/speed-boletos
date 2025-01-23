import firebird from 'node-firebird';

export var dbOptions = {
    host: process.env.NEXT_API_HOST,
    port: 3050,
    database: "/database/Financeiro/financeiro.fdb",
    user: process.env.NEXT_API_USER,
    password: process.env.NEXT_API_PASSWORD
};

export var dbBlob = {
    host: process.env.NEXT_API_HOST,
    port: 3050,
    database: "/database/Financeiro/financeiro.fdb",
    user: process.env.NEXT_API_USER,
    password: process.env.NEXT_API_PASSWORD,
}

async function executeTransaction(ssql: string, params: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            firebird.attach(dbOptions, (err, db) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                };

                db.transaction(firebird.ISOLATION_READ_COMMITTED, async (err, transaction) => {
                    if (err) {
                        db.detach();
                        console.log(err);
                        return reject(err);
                    };

                    transaction.query(ssql, params, (err, result) => {
                        if (err) {
                            transaction.rollback(() => {
                                db.detach();
                                console.log(err);
                                return reject(err);
                            });
                        } else {
                            transaction.commit(() => {
                                db.detach();
                                return resolve(result);
                            })
                        };
                    })
                })
            })
        } catch (error) {
            throw new Error(error);
        }
    })
}

async function executeQuery(query: string, params: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        firebird.attachOrCreate(dbOptions, (err, db) => {
            if (err) {
                console.log(err);
                return reject(err)
            }

            db.query(query, params, (err, result: any[]) => {
                if (err) {
                    console.log(err);
                    return reject(err)
                }

                return resolve(result)
            })
        })
    })
}

async function executeQueryBlob(ssql: string, params: any): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        firebird.attach(dbBlob, (err, db) => {
            if (err)

                throw err;
            console.log(err);
            db.transaction(firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                transaction.query(ssql, params, (err: any, result: any[]) => {
                    if (err) {
                        transaction.rollback();
                        console.log(err);
                        return;
                    }

                    const arrBlob = [];
                    for (const item of result) {
                        const fields = Object.keys(item);
                        for (const key of fields) {
                            if (typeof item[key] === 'function') {
                                item[key] = new Promise((resolve, reject) => {
                                    item[key](transaction, (error: any, name: any, event: any, row: any) => {
                                        if (error) {
                                            return reject(error);
                                        }

                                        let value = '';
                                        event.on('data', (chunk: any) => {
                                            value += chunk.toString('binary');
                                        });
                                        event.on('end', () => {
                                            resolve({ value, column: name, row });
                                        });
                                    });
                                });
                                arrBlob.push(item[key]);
                            }
                        }
                    }

                    Promise.all(arrBlob).then((blobs) => {
                        for (const blob of blobs) {
                            result[blob.row][blob.column] = blob.value;
                        }

                        transaction.commit((err) => {
                            if (err) {
                                transaction.rollback();
                                return;
                            }

                            db.detach();
                            return resolve(result);
                        });
                    }).catch((err) => {
                        transaction.rollback();
                        console.log(err);
                        return reject(err);
                    });
                });
            });
        });
    }
    )
};

export { executeTransaction, executeQuery, executeQueryBlob, firebird };
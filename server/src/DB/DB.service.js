

export const findOne =
    async ({ model = {},
        fillter = {},
        select = "",
        populate = [] } = {}) => {
        return await model.findOne(fillter).select(select).populate(populate);
    }

export const findById =
    async ({ model = {},
        id = {},
        select = "",
        populate = [] } = {}) => {
        return await model.findById(id).select(select).populate(populate);
    }


export const create =
    async ({ model = {},
        data = [{}],
        options = {} } = {}) => {
        return await model.create([data], { options });
    }

export const updateOne = async ({ model = {},
    fillter = {},
    data = {},
    options = { runValidators: true } } = {}) => {
    return await model.updateOne(fillter, {
        ...data,
        $inc: { __v: 1 }
    }, data, options);
};


export const findOneAndUpdate =
    async ({ model = {},
        fillter = {},
        select = "",
        data = {},
        populate = [],
        options = { runValidators: true, new: true }
    } = {}) => {
        return await model.findOneAndUpdate(fillter, {
            ...data,
            $inc: { __v: 1 }
        }, options
        ).select(select).populate(populate);
    }


export const deleteOne =
    async ({ model = {},
        fillter = {},
    } = {}) => {
        return await model.deleteOne(fillter);
    }
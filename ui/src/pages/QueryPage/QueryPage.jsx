import classNames from "classnames";

const QueryPage = () => {

    return (
        <div className={classNames({
            "lv-query-page": true,
        })}>

            <div className="lv-query-page-content">
                <div className={classNames({
                    "lv-query-page-header": true,
                    "lv-block": true,
                })}>
                    
                </div>
            </div>
        </div>
    )
}

export default QueryPage;
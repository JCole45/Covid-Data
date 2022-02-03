import "./landing-page.scss";
import React, { useEffect, useState } from "react";
import { mainModule } from "john-c-new-package";
import { TableView, DateField, DropdownField, Loader, BusyButton } from "react-simple-widgets";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { countries } from "../../common/countries";
import { createStatusSpan } from "../../common";

interface IValues {
    country: string;
    from: string;
    to: string;
}

export const LandingPage = (): any => {
    document.title = "testing_npm_package";

    const sorterd_countries = countries.sort((a: any, b: any) => {
        if (a.Country < b.Country) return -1;
        if (a.Country > b.Country) return 1;
        return 0;
    });

    useEffect(() => {}, []);

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        country: "",
        from: "",
        to: ""
    };

    const validationSchema = Yup.object({
        country: Yup.string().required("Required"),
        from: Yup.date().required("Required"),
        to: Yup.date().required("Required")
    });

    const testPackage = async (values: IValues) => {
        console.log(values);
        setLoading(true);
        mainModule
            .getCovidData(new Date(values.from).toISOString(), new Date(values.to).toISOString(), values.country)
            .then((data: any) => {
                setCases(data);
            })
            .catch((err: any) => {
                console.log(err);
            })
            .then(() => {
                setLoading(false);
            });

        console.log(mainModule.message());
    };

    return (
        <div id="landing-page" className="grid-center h-100">
            <div className="container d-flex flex-column justify-content-start align-items-center w-640">
                <h2 className="fw-300 mb-5">World Covid Data</h2>

                <div style={{ width: "100%" }}>
                    <Formik onSubmit={testPackage} initialValues={initialValues} validationSchema={validationSchema}>
                        {formik => (
                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-3">
                                    <DropdownField name="country" label="Country Name">
                                        <option value={null}></option>
                                        {sorterd_countries.map((country: any) => {
                                            return (
                                                <option key={country.ISO2} value={country.Slug}>
                                                    {country.Country}
                                                </option>
                                            );
                                        })}
                                    </DropdownField>
                                </div>

                                <div className="mb-3 d-flex justify-content-between">
                                    <span style={{ width: "46%" }}>
                                        <DateField
                                            name="from"
                                            label="From"
                                            placeholder="from"
                                            displayFormat="dddd, Do MMMM YYYY"
                                            onChange={date => {
                                                if (moment(date).isAfter(moment())) {
                                                    formik.setFieldValue("from", moment().format("YYYY-MM-DD"));
                                                }
                                            }}
                                        />
                                    </span>

                                    <span style={{ width: "46%" }}>
                                        <DateField
                                            name="to"
                                            label="To"
                                            placeholder="to"
                                            displayFormat="dddd, Do MMMM YYYY"
                                            onChange={date => {
                                                if (moment(date).isBefore(formik.values.from) || moment(date).isAfter()) {
                                                    formik.setFieldValue("to", moment().format("YYYY-MM-DD"));
                                                }
                                            }}
                                        />
                                    </span>
                                </div>
                                {/* <button type="submit" className="btn btn-primary">
                                    Get Covid Data
                                </button> */}
                                <BusyButton type="submit" className="btn btn-primary" busy={loading}>
                                    Get Covid Data
                                </BusyButton>
                            </form>
                        )}
                    </Formik>
                </div>

                {loading && (
                    <div className="d-flex">
                        Please wait <Loader />
                    </div>
                )}
                <TableView
                    items={cases}
                    props={[
                        ["No.", req => cases.indexOf(req) + 1],
                        ["Country", "Country"],
                        ["Country Code", "CountryCode"],
                        ["Cases", "Cases"],
                        ["Date", req => moment(req.Date).format("dddd, Do MMMM YYYY")],
                        ["Status", req => createStatusSpan(req.Status)]
                    ]}
                />
            </div>
        </div>
    );
};

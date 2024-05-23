import React, { useState } from "react";

function Formulaire(props) {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [localisation, setLocalisation] = useState("");
    const [dateHeure, setDateHeure] = useState("");
    const [step, setStep] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    const MAPBOX_API_KEY = "pk.eyJ1IjoiYXNoaWtvIiwiYSI6ImNsd2hzdDgxODAzMmEya3JsdjVtbmdibzcifQ.XZiclmMszAsSnU5rhlYTeg"; // Remplacez par votre clé API Mapbox

    function handleChange(e, setState) {
        setState(e.target.value);
    }

    async function handleLocalisationChange(e) {
        const value = e.target.value;
        setLocalisation(value);

        if (value.length > 2) {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${MAPBOX_API_KEY}&autocomplete=true`
                );
                const data = await response.json();
                setSuggestions(data.features);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    }

    function handleSuggestionClick(suggestion) {
        setLocalisation(suggestion.place_name);
        setSuggestions([]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const tache = { nom, description, localisation, dateHeure };
        props.ajtTache(tache);
        setNom("");
        setDescription("");
        setLocalisation("");
        setDateHeure("");
        setStep(0);
    }

    function handleKeyPress(e) {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            setStep(step + 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setStep(Math.max(step - 1, 0));
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setStep(Math.min(step + 1, 5));
        }
    }

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
            {step === 0 && (
                <div>
                    <button type="submit" title="Ajouter une nouvelle tâche" onClick={() => setStep(1)}>
                        &#10133;
                    </button>
                </div>
            )}
            {step === 1 && (
                <div>
                    <input
                        type="text"
                        id="new-todo-input"
                        className="input input__lg"
                        name="nom"
                        autoComplete="off"
                        value={nom}
                        onChange={(e) => handleChange(e, setNom)}
                        placeholder="&#9999;&#65039; &bull; Tâche à réaliser"
                    />
                </div>
            )}
            {step === 2 && (
                <div>
                    <textarea
                        id="new-todo-input"
                        className="input input__lg"
                        name="description"
                        autoComplete="off"
                        value={description}
                        onChange={(e) => handleChange(e, setDescription)}
                        placeholder="&#128203; &bull; Description de la tâche"
                        maxLength={420}
                        rows={1}
                        style={{
                            resize: 'vertical',
                            overflowY: description.split('\n').length > 1 ? 'scroll' : 'hidden',
                        }}
                    />
                </div>
            )}
            {step === 3 && (
                <div>
                    <input
                        type="text"
                        id="new-todo-input"
                        className="input input__lg"
                        name="localisation"
                        autoComplete="off"
                        value={localisation}
                        onChange={handleLocalisationChange}
                        placeholder="&#128204; &bull; Localisation de la tâche"
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.place_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {step === 4 && (
                <div>
                    <input
                        type="text"
                        id="new-todo-input"
                        className="input input__lg"
                        name="dateHeure"
                        autoComplete="off"
                        value={dateHeure}
                        onChange={(e) => handleChange(e, setDateHeure)}
                        placeholder="&#128197;&middot;&#128339; &bull; Date & Heure"
                        pattern="\d{2}/\d{2}/\d{4}, \d{2}:\d{2}"
                        title="Entrez une date au format jj/mm/aaaa, hh:mm"
                    />
                </div>
            )}
            {step === 5 && (
                <div>
                    <button type="submit" title="Ajouter la tâche à la liste ?">&#128190; Ajouter "<b>{nom}</b>" à la liste ?</button>
                </div>
            )}
            <div className="dots-container">
                {[0, 1, 2, 3, 4, 5].map((dot, index) => (
                    <span
                        key={index}
                        className={`dot ${step === index ? "active" : ""}`}
                        onClick={() => setStep(index)}
                    >
                        &#9679;
                    </span>
                ))}
            </div>
            {step === 5 && (
                <div className="resume">
                    <h4>&#128203; Description</h4>
                    <p>{description}</p>
                    <h4>&#128204; Localisation </h4>
                    <p>{localisation}</p>
                    <h4>&#128197; Date/Heure </h4>
                    <p>{dateHeure}</p>
                </div>
            )}
        </form>
    );
}

export default Formulaire;
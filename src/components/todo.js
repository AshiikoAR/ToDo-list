import { useEffect, useRef, useState } from "react";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default function Todo(props) {
    const [estModif, setModif] = useState(false);
    const [nouvNom, setNouvNom] = useState(props.nom); // Initialiser avec la valeur existante de la propriété nom
    const [nouvDesc, setNouvDesc] = useState(props.description); // Initialiser avec la valeur existante de la propriété description
    const [nouvLoca, setNouvLoca] = useState(props.localisation); // Initialiser avec la valeur existante de la propriété localisation
    const [nouvDh, setNouvDh] = useState(props.dateHeure); // Initialiser avec la valeur existante de la propriété dateHeure
    const [selectedOption, setSelectedOption] = useState("Modifier le nom de la tâche");
    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);

    const aEteModif = usePrevious(estModif);
    
    function handleChangeNom(e) {
        setNouvNom(e.target.value);
    }

    function handleChangeDesc(e) {
        setNouvDesc(e.target.value);
    }

    function handleChangeLoca(e) {
        setNouvLoca(e.target.value);
    }

    function handleChangeDh(e) {
        setNouvDh(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.modifTache(props.id, nouvNom, nouvDesc, nouvLoca, nouvDh);
        setModif(false);
    }

    function handleSelectChange(e) {
        setSelectedOption(e.target.value);
    }
    
    const modifTemplate = (
        <form className="stack-small" onSubmit={handleSubmit}>
            <div className="form-group">
                <select name="modifs" id="modif-select" onChange={handleSelectChange} value={selectedOption}>
                    <option value="Modifier le nom de la tâche">Modifier le nom de la tâche</option>
                    <option value="Modifier la description">Modifier la description</option>
                    <option value="Modifier la localisation"> Modifier la localisation</option>
                    <option value="Modifier la date/l'heure">Modifier la date/l'heure</option>
                </select>
                {selectedOption === "Modifier le nom de la tâche" && (
                    <div>
                        <input 
                            id={props.id} 
                            className="todo-text" 
                            type="text" 
                            value={nouvNom} 
                            onChange={handleChangeNom} 
                            ref={editFieldRef}
                            placeholder="Nouveau nom"
                        />
                    </div>
                )}
                {selectedOption === "Modifier la description" && (
                    <div>
                        <input 
                            id={props.id} 
                            className="todo-text" 
                            type="text" value={nouvDesc} 
                            onChange={handleChangeDesc} 
                            ref={editFieldRef}
                            placeholder="Nouvelle description"
                        />
                    </div>
                )}
                {selectedOption === "Modifier la localisation" && (
                    <div>
                        <input 
                            id={props.id} 
                            className="todo-text" 
                            type="text" 
                            value={nouvLoca} 
                            onChange={handleChangeLoca} 
                            ref={editFieldRef} 
                            placeholder="Nouvelle localisation"
                        />
                    </div>
                )}
                {selectedOption === "Modifier la date/l'heure" && (
                    <div>
                        <input 
                            id={props.id} 
                            className="todo-text" 
                            type="text" 
                            value={nouvDh}
                            onChange={handleChangeDh} 
                            ref={editFieldRef}
                            placeholder="Nouvelle date/heure"
                            pattern="\d{2}/\d{2}/\d{4}, \d{2}:\d{2}"
                        />
                    </div>
                )}
            </div>
            <div className="btn-group">
                <button type="button" className="btn todo-cancel" onClick={() => setModif(false)}>&#128281; Annuler</button>
                <button type="submit" className="btn btn__primary todo-edit">&#128190; Sauvegarder</button>
            </div>
        </form>
    );

    const voirTemplate = (
        <div className="stack-small">
            <div className="c-cb">
                <input id={props.id} type="checkbox" defaultChecked={props.completed} onChange={() => props.majTacheCompletee(props.id)} />
                <label className="todo-label" htmlFor={props.id}>
                    <li><b>&nbsp;{props.nom}</b></li>
                    <li>&#128203; {props.description}</li>
                    <li>&#128204; {props.localisation}</li>
                    <li>&#128197; {props.dateHeure}</li>
                </label>
            </div>
            <div className="btn-group">
                <button type="button" className="btn" onClick={() => setModif(true)} ref={editButtonRef}>&#128221; Modifier</button>
                <button type="button" className="btn btn__danger" onClick={handleDeleteClick}>&#128465;&#65039; Supprimer</button>
            </div>
        </div>
    );

    useEffect(() => {
        if (!aEteModif && estModif) {
            editFieldRef.current.focus();
        } else if (aEteModif && !estModif) {
            editButtonRef.current.focus();
        }
    }, [aEteModif, estModif]);

    function handleDeleteClick() {
        const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (isConfirmed) {
            props.suppTache(props.id);
        }
    }
    
    return <li className="todo">{estModif ? modifTemplate : voirTemplate}</li>;
}

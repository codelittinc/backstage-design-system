import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import SearchableSelect from "./SearchableSelect";
import type { SearchableSelectOption } from "./SearchableSelect";

const sampleOptions: SearchableSelectOption[] = [
  { value: "1", label: "Acme Corporation", sublabel: "Enterprise Plan" },
  { value: "2", label: "Globex Industries", sublabel: "Starter Plan" },
  { value: "3", label: "Initech Solutions", sublabel: "Pro Plan" },
  { value: "4", label: "Umbrella Corp", sublabel: "Enterprise Plan" },
];

const meta = {
  title: "Form/SearchableSelect",
  component: SearchableSelect,
  tags: ["autodocs"],
  args: {
    onSearchChange: fn(),
    onSelect: fn(),
    onClear: fn(),
  },
} satisfies Meta<typeof SearchableSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchValue: "",
    selectedOption: null,
    options: [],
    placeholder: "Search companies...",
  },
  render: function SearchableSelectStory(args) {
    const [searchValue, setSearchValue] = useState(args.searchValue);
    const [selectedOption, setSelectedOption] = useState(args.selectedOption);
    const filtered =
      searchValue.length >= (args.minChars || 2)
        ? sampleOptions.filter((o) =>
            o.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : [];
    return (
      <div style={{ width: 400 }}>
        <SearchableSelect
          {...args}
          searchValue={searchValue}
          onSearchChange={(v) => {
            setSearchValue(v);
            args.onSearchChange(v);
          }}
          options={filtered}
          selectedOption={selectedOption}
          onSelect={(o) => {
            setSelectedOption(o);
            args.onSelect(o);
          }}
          onClear={() => {
            setSelectedOption(null);
            setSearchValue("");
            args.onClear();
          }}
        />
      </div>
    );
  },
} satisfies Story;

export const WithSelectedOption: Story = {
  args: {
    searchValue: "",
    selectedOption: { value: "1", label: "Acme Corporation", sublabel: "Enterprise Plan" },
    options: [],
    placeholder: "Search companies...",
  },
  render: function SearchableSelectStory(args) {
    const [searchValue, setSearchValue] = useState(args.searchValue);
    const [selectedOption, setSelectedOption] = useState(args.selectedOption);
    const filtered =
      searchValue.length >= (args.minChars || 2)
        ? sampleOptions.filter((o) =>
            o.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : [];
    return (
      <div style={{ width: 400 }}>
        <SearchableSelect
          {...args}
          searchValue={searchValue}
          onSearchChange={(v) => {
            setSearchValue(v);
            args.onSearchChange(v);
          }}
          options={filtered}
          selectedOption={selectedOption}
          onSelect={(o) => {
            setSelectedOption(o);
            args.onSelect(o);
          }}
          onClear={() => {
            setSelectedOption(null);
            setSearchValue("");
            args.onClear();
          }}
        />
      </div>
    );
  },
} satisfies Story;

export const Loading: Story = {
  args: {
    searchValue: "Acme",
    selectedOption: null,
    options: [],
    loading: true,
    placeholder: "Search companies...",
  },
  render: function SearchableSelectStory(args) {
    const [searchValue, setSearchValue] = useState(args.searchValue);
    const [selectedOption, setSelectedOption] = useState(args.selectedOption);
    const filtered =
      searchValue.length >= (args.minChars || 2)
        ? sampleOptions.filter((o) =>
            o.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : [];
    return (
      <div style={{ width: 400 }}>
        <SearchableSelect
          {...args}
          searchValue={searchValue}
          onSearchChange={(v) => {
            setSearchValue(v);
            args.onSearchChange(v);
          }}
          options={args.loading ? [] : filtered}
          selectedOption={selectedOption}
          onSelect={(o) => {
            setSelectedOption(o);
            args.onSelect(o);
          }}
          onClear={() => {
            setSelectedOption(null);
            setSearchValue("");
            args.onClear();
          }}
        />
      </div>
    );
  },
} satisfies Story;

export const WithError: Story = {
  args: {
    searchValue: "test",
    selectedOption: null,
    options: [],
    error: "Failed to fetch results. Please try again.",
    placeholder: "Search companies...",
  },
  render: function SearchableSelectStory(args) {
    const [searchValue, setSearchValue] = useState(args.searchValue);
    const [selectedOption, setSelectedOption] = useState(args.selectedOption);
    const filtered =
      searchValue.length >= (args.minChars || 2)
        ? sampleOptions.filter((o) =>
            o.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : [];
    return (
      <div style={{ width: 400 }}>
        <SearchableSelect
          {...args}
          searchValue={searchValue}
          onSearchChange={(v) => {
            setSearchValue(v);
            args.onSearchChange(v);
          }}
          options={args.error ? [] : filtered}
          selectedOption={selectedOption}
          onSelect={(o) => {
            setSelectedOption(o);
            args.onSelect(o);
          }}
          onClear={() => {
            setSelectedOption(null);
            setSearchValue("");
            args.onClear();
          }}
        />
      </div>
    );
  },
} satisfies Story;

export const Gallery: Story = {
  args: {
    searchValue: "",
    selectedOption: null,
    options: [],
  },
  parameters: {
    layout: "padded",
  },
  render: function SearchableSelectGallery() {
    const [sv1, setSv1] = useState("");
    const [so1, setSo1] = useState<SearchableSelectOption | null>(null);
    const [sv2, setSv2] = useState("");
    const [so2, setSo2] = useState<SearchableSelectOption | null>({
      value: "1",
      label: "Acme Corporation",
      sublabel: "Enterprise Plan",
    });
    const [sv3, setSv3] = useState("");
    const [so3, setSo3] = useState<SearchableSelectOption | null>(null);

    const getFiltered = (search: string, minChars = 2) =>
      search.length >= minChars
        ? sampleOptions.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 400 }}>
        <div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Default</p>
          <SearchableSelect
            searchValue={sv1}
            onSearchChange={setSv1}
            options={getFiltered(sv1)}
            selectedOption={so1}
            onSelect={setSo1}
            onClear={() => { setSo1(null); setSv1(""); }}
            placeholder="Search companies..."
          />
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>With selected option</p>
          <SearchableSelect
            searchValue={sv2}
            onSearchChange={setSv2}
            options={getFiltered(sv2)}
            selectedOption={so2}
            onSelect={setSo2}
            onClear={() => { setSo2(null); setSv2(""); }}
            placeholder="Search companies..."
          />
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Custom placeholder</p>
          <SearchableSelect
            searchValue={sv3}
            onSearchChange={setSv3}
            options={getFiltered(sv3)}
            selectedOption={so3}
            onSelect={setSo3}
            onClear={() => { setSo3(null); setSv3(""); }}
            placeholder="Find an organization..."
          />
        </div>
      </div>
    );
  },
} satisfies Story;
